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

  async findAllRooms(paginationDto: PaginationDto) {

    const { page, limit, isAvailable } = paginationDto;

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

    try {

      await this.findRoomById( id ) as Room;;
      const { resources, ...roomData } = updateRoomDto;
    
      if (resources) {
        await this.roomResource.deleteMany({
          where: { roomId: id },
        });
  
        await this.roomResource.createMany({
          data: resources.map((resource) => ({
            roomId: id, 
            name: resource.name,
            category: resource.category,
            description: resource.description,
          })),
        });
      }
  
      return await this.room.update({
        where: { id },
        data: { ...roomData },
        include: { 
          resources: true 
        }, 
      });
      
    } catch (error) {
      this.commonService.globalErrorHandler(error);
    }

  }
  

  async deleteRoom(id: string) {

    try {

      await this.findRoomById( id )
    
      return await this.room.delete({
        where: { 
          id: id 
        },
      });

    } catch (error) {
      this.commonService.globalErrorHandler(error);
    }

  }
  
}
