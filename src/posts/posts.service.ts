import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../../schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postModel: Model<Post>) {}

  // Create a new post
  async create(
    createPostDto: CreatePostDto,
  ): Promise<{ message: string; status: number; data: Post }> {
    const createdPost = new this.postModel(createPostDto);
    await createdPost.save();
    return {
      message: 'Post created successfully',
      status: 201,
      data: createdPost,
    };
  }

  // Find all posts
  async findAll(): Promise<{ message: string; status: number; data: Post[] }> {
    const posts = await this.postModel.find().sort({ _id: -1 }).exec();
    return {
      message: 'Posts fetched successfully',
      status: 200,
      data: posts,
    };
  }

  // Find a post by ID
  async findOne(
    id: string,
  ): Promise<{ message: string; status: number; data: Post | null }> {
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

  async findByUserId(
    userId: string,
  ): Promise<{ message: string; status: number; data: Post[] }> {
    const posts = await this.postModel
      .find({ userId })
      .sort({ _id: -1 })
      .exec();
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
  async update(
    id: string,
    updatePostDto: UpdatePostDto,
  ): Promise<{ message: string; status: number; data: Post | null }> {
    const updatedPost = await this.postModel
      .findByIdAndUpdate(id, updatePostDto, {
        new: true,
      })
      .exec();
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

  async incrementReact(
    id: string,
    userId: string,
  ): Promise<{ message: string; status: number; data: Post | null }> {
    const post = await this.postModel.findById(id).exec();
    if (!post) {
      return {
        message: `Post with ID ${id} not found`,
        status: 404,
        data: null,
      };
    }
    if (post.userReacted && post.userReacted.includes(userId)) {
      return {
        message: `User with ID ${userId} has already reacted to this post.`,
        status: 400,
        data: null,
      };
    }
    const updatedPost = await this.postModel
      .findByIdAndUpdate(
        id,
        { $push: { userReacted: userId } }, // Add userId to the userReacted array
        { new: true },
      )
      .exec();

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

  async decrementReact(
    id: string,
    userId: string,
  ): Promise<{ message: string; status: number; data: Post | null }> {
    // Find the post by ID
    const post = await this.postModel.findById(id).exec();

    if (!post) {
      return {
        message: `Post with ID ${id} not found`,
        status: 404,
        data: null,
      };
    }

    // Check if the userId is in the userReacted array
    if (!post.userReacted || !post.userReacted.includes(userId)) {
      return {
        message: `User with ID ${userId} has not reacted to this post.`,
        status: 400,
        data: null,
      };
    }

    // Remove the userId from the userReacted array
    const updatedPost = await this.postModel
      .findByIdAndUpdate(
        id,
        {
          $pull: { userReacted: userId }, // Remove the userId from the userReacted array
        },
        { new: true },
      )
      .exec();

    if (updatedPost) {
      const reactsCount = updatedPost.userReacted.length;
      await this.postModel
        .findByIdAndUpdate(id, { reactsCount }, { new: true })
        .exec();
    }

    return {
      message: 'Post updated successfully',
      status: 200,
      data: updatedPost,
    };
  }

  async updateReact(
    id: string,
    userId: string,
  ): Promise<{ message: string; status: number; data: Post | null }> {
    const post = await this.postModel.findById(id).exec();

    if (!post) {
      return {
        message: `Post with ID ${id} not found`,
        status: 404,
        data: null,
      };
    }

    // Check if the userId is already in the userReacted array
    if (post.userReacted && post.userReacted.includes(userId)) {
      // If the user has already reacted, remove the userId from the array
      const updatedPost = await this.postModel
        .findByIdAndUpdate(
          id,
          {
            $pull: { userReacted: userId }, // Remove the userId from the userReacted array
          },
          { new: true },
        )
        .exec();

      if (updatedPost) {
        const reactsCount = updatedPost.userReacted.length; // Update reactsCount based on the userReacted array length
        await this.postModel
          .findByIdAndUpdate(id, { reactsCount }, { new: true })
          .exec();
      }

      return {
        message: 'Reaction removed successfully',
        status: 200,
        data: updatedPost,
      };
    } else {
      // If the user hasn't reacted yet, add the userId to the userReacted array
      const updatedPost = await this.postModel
        .findByIdAndUpdate(
          id,
          {
            $push: { userReacted: userId },
          },
          { new: true },
        )
        .exec();

      if (updatedPost) {
        const reactsCount = updatedPost.userReacted.length;
        await this.postModel
          .findByIdAndUpdate(id, { reactsCount }, { new: true })
          .exec();
      }

      return {
        message: 'Reaction added successfully',
        status: 200,
        data: updatedPost,
      };
    }
  }

  async remove(
    id: string,
  ): Promise<{ message: string; status: number; data: Post | null }> {
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
