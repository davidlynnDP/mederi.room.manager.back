import { Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaClient, Room } from '@prisma/client';

import { CreateRoomDto, UpdateRoomDto, UpdateRoomResourceDto } from './dto';
import { CommonService } from 'src/common/common.service';
import { PaginationDto } from 'src/common/dto';

@Injectable()
export class RoomsService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger('RoomsService');

  async onModuleInit() {
    await this.$connect();
    this.logger.log('Database connected');
  }

  constructor(
    private readonly commonService: CommonService
  ) {
    super();
  }

  async createRoom(createRoomDto: CreateRoomDto) {
    const { resources, ...roomData } = createRoomDto;

    try {
      return this.room.create({
        data: {
          ...roomData,
          resources: {
            createMany: {
              data: resources.map(resource => ({
                name: resource.name,
                category: resource.category,
                description: resource.description,
              })),
            },
          },
        },
        include: {
          resources: true,
        },
      });
      
    } catch (error) {
      this.commonService.globalErrorHandler(error);
    }

  }

  async findAllRooms(paginationDto: PaginationDto, isAvailable: boolean = true) {

    const { page, limit } = paginationDto;

    const totalPages = await this.room.count({ where: { isAvailable } }); 
    const lastPage = Math.ceil(totalPages / limit);

    return {
      data: await this.room.findMany({
        skip: (page - 1) * limit,
        take: limit,
        where: { 
          isAvailable
        },
      }),
      meta: {
        total: totalPages,
        page: page,
        lastPage: lastPage,
      },
    };
  }

  async findRoomById(id: string) {

    const room = await this.room.findFirst({
      where: {
        id: id
      },
      include: {
        resources: true
      }
    });
  
    if (!room) {
      throw new NotFoundException(`Room with ID ${ id } not found`);
    }
    
    return room;
  }
  

  async updateRoom(id: string, updateRoomDto: UpdateRoomDto) {

    await this.findRoomById( id ) as Room;;
    const { resources, ...roomData } = updateRoomDto;
  
    return await this.room.update({
      where: { 
        id: id 
      },
      data: {
        ...roomData,
        resources: resources ? this.processResources(resources) : undefined,
      },
      include: { 
        resources: true
      },
    });
  }
  

  async deleteRoom(id: string) {
    return await this.room.delete({
      where: { 
        id: id 
      },
    });
  }

  private processResources(resources: UpdateRoomResourceDto[]) {
    return {
      upsert: resources.map((resource) => ({
        where: { 
          id: resource.id || undefined 
        }, 
        update: {
          name: resource.name,
          category: resource.category,
          description: resource.description,
        },
        create: {
          name: resource.name,
          category: resource.category,
          description: resource.description,
        },
      })),
    };
  }
  
}
