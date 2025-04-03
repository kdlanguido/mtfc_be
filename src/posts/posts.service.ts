import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../../schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
  ) { }

  // Create a new post
  async create(createPostDto: CreatePostDto): Promise<{ message: string, status: number, data: Post }> {
    const createdPost = new this.postModel(createPostDto);
    await createdPost.save();
    return {
      message: 'Post created successfully',
      status: 201,
      data: createdPost,
    };
  }

  // Find all posts
  async findAll(): Promise<{ message: string, status: number, data: Post[] }> {
    const posts = await this.postModel.find().sort({ _id: -1 }).exec();
    return {
      message: 'Posts fetched successfully',
      status: 200,
      data: posts,
    };
  }

  // Find a post by ID
  async findOne(id: string): Promise<{ message: string, status: number, data: Post | null }> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      return {
        message: `Post with ID ${id} not found`,
        status: 404,
        data: null,
      };
    }
    return {
      message: 'Post fetched successfully',
      status: 200,
      data: post,
    };
  }

  // Find posts by user ID
  async findByUserId(userId: string): Promise<{ message: string, status: number, data: Post[] }> {
    const posts = await this.postModel.find({ userId }).sort({ _id: -1 }).exec();
    if (posts.length === 0) {
      return {
        message: `No posts found for user with ID ${userId}`,
        status: 404,
        data: [],
      };
    }
    return {
      message: 'Posts fetched successfully',
      status: 200,
      data: posts,
    };
  }

  // Update a post by ID
  async update(id: string, updatePostDto: UpdatePostDto): Promise<{ message: string, status: number, data: Post | null }> {
    const updatedPost = await this.postModel.findByIdAndUpdate(id, updatePostDto, {
      new: true,
    }).exec();
    if (!updatedPost) {
      return {
        message: `Post with ID ${id} not found`,
        status: 404,
        data: null,
      };
    }
    return {
      message: 'Post updated successfully',
      status: 200,
      data: updatedPost,
    };
  }

  // Remove a post by ID
  async remove(id: string): Promise<{ message: string, status: number, data: Post | null }> {
    const deletedPost = await this.postModel.findByIdAndDelete(id).exec();
    if (!deletedPost) {
      return {
        message: `Post with ID ${id} not found`,
        status: 404,
        data: null,
      };
    }
    return {
      message: 'Post deleted successfully',
      status: 200,
      data: deletedPost,
    };
  }
}
