import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { AddCommentDto } from './dto/add-comment.dto';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Get('/find-by-id/:id')
  findByUserId(@Param('id') id: string) {
    return this.postsService.findByUserId(id);
  }

  @Patch('/update-react/:id/:userId')
  updateReact(@Param('id') id: string, @Param('userId') userId: string) {
    return this.postsService.updateReact(id, userId);
  }

  @Post('/add-comment/:id')
  async addComment(
    @Param('id') id: string,
    @Body() addCommentDto: AddCommentDto,
  ) {
    const { userId, comment } = addCommentDto;
    return this.postsService.addComment(id, userId, comment);
  }

  @Post('/delete-comment/:id')
  async deleteComment(
    @Param('id') id: string,
    @Body() deleteCommentDto: { commentId: string },
  ) {
    const { commentId } = deleteCommentDto;
    return this.postsService.deleteComment(id, commentId);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
