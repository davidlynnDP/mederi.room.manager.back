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

  // /rooms
  @Post()
  async createRoom(
    @Body() createRoomDto: CreateRoomDto
  ) {
    return await this.roomsService.createRoom(createRoomDto);
  }

  // /rooms/find?page=1&limit=10&isAvailable=true
  @Get('find')
  async findAllRooms(
    @Query() paginationDto: PaginationDto,
  ) {
    return await this.roomsService.findAllRooms(paginationDto);
  }

  // /rooms/find/123e4567-e89b-12d3-a456-426614174000
  @Get('find/:id')
  async findRoomById(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return await this.roomsService.findRoomById(id);
  }

  // /rooms/123e4567-e89b-12d3-a456-426614174000
  @Patch(':id')
  async updateRoom(
    @Param('id', ParseUUIDPipe) id: string, 
    @Body() updateRoomDto: UpdateRoomDto
  ) {
    return await this.roomsService.updateRoom(id, updateRoomDto);
  }
  
  // /rooms/123e4567-e89b-12d3-a456-426614174000
  @Delete(':id')
  async deleteRoom(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return await this.roomsService.deleteRoom(id);
  }


}
