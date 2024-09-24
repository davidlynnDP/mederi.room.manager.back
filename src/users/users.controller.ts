import { Controller, Get, Body, Patch, Param, Delete, Query, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto';
import { PaginationDto } from 'src/common/dto';
import { JwtOauthGuard } from 'src/auth/guards/jwt.oauth.guard';

@UseGuards(JwtOauthGuard)
@Controller('users')
export class UsersController {

  constructor(
    private readonly usersService: UsersService
  ) {}

  @Get('find')
  async findAllUsers(
    @Query() paginationDto: PaginationDto
  ) {
    return await this.usersService.findAllUsers(paginationDto);
  }

  @Get('find/:id')
  async findOneUser(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return await this.usersService.findOneUser({ id });
  }

  @Patch(':id')
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.updateUser(id, updateUserDto);
  }

  @Delete(':id')
  async removeUser(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return await this.usersService.removeUser( id );
  }
}
