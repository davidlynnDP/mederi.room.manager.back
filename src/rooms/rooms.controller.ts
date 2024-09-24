import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, ParseUUIDPipe, ParseBoolPipe } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto, UpdateRoomDto } from './dto';
import { JwtOauthGuard } from 'src/auth/guards/jwt.oauth.guard';
import { PaginationDto } from 'src/common/dto';

@UseGuards(JwtOauthGuard)
@Controller('rooms')
export class RoomsController {

  constructor(
    private readonly roomsService: RoomsService
  ) {}

  @Post()
  async createRoom(
    @Body() createRoomDto: CreateRoomDto
  ) {
    return await this.roomsService.createRoom(createRoomDto);
  }

  @Get('find')
  async findAllRooms(
    @Query() paginationDto: PaginationDto,
  ) {
    return await this.roomsService.findAllRooms(paginationDto);
  }

  @Get('find/:id')
  async findRoomById(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return await this.roomsService.findRoomById(id);
  }

  @Patch(':id')
  async updateRoom(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateRoomDto: UpdateRoomDto
  ) {
    return await this.roomsService.updateRoom(id, updateRoomDto);
  }
  
  @Delete(':id')
  async deleteRoom(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return await this.roomsService.deleteRoom(id);
  }

}
