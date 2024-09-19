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

  // /users/find?page=1&limit=10
  @Get('find')
  async findAllUsers(
    @Query() paginationDto: PaginationDto
  ) {
    return await this.usersService.findAllUsers(paginationDto);
  }

  // /users/find/:id
  @Get('find/:id')
  async findOneUser(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return await this.usersService.findOneUser({ id });
  }

  // /users/:id
  @Patch(':id')
  async updateUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.updateUser(id, updateUserDto);
  }

  // /users/:id
  @Delete(':id')
  async removeUser(
    @Param('id', ParseUUIDPipe) id: string
  ) {
    return await this.usersService.removeUser( id );
  }
}
