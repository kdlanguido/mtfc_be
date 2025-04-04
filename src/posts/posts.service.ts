import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post } from '../../schemas/post.schema';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { v4 as uuidv4 } from 'uuid'; // Import uuid to generate unique comment IDs
import { User } from 'schemas/user.schema';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private postModel: Model<Post>,
    @InjectModel(User.name) private UserModel: Model<User>,
  ) {}

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

  async findAll(): Promise<{ message: string; status: number; data: Post[] }> {
    const posts = await this.postModel.find().sort({ _id: -1 }).exec();
    return {
      message: 'Posts fetched successfully',
      status: 200,
      data: posts,
    };
  }

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

  async addComment(
    id: string,
    userId: string,
    comment: string,
  ): Promise<{ message: string; status: number; data: Post | null }> {
    const post = await this.postModel.findById(id).exec();
    const userData = await this.UserModel.findById(userId).exec();

    if (!post) {
      return {
        message: `Post with ID ${id} not found`,
        status: 404,
        data: null,
      };
    }

    console.log(userData.profileUrl);

    const newComment = {
      commentId: uuidv4(),
      fullName: userData.fullName,
      profileUrl: userData.profileUrl,
      comment: comment,
    };

    const updatedPost = await this.postModel
      .findByIdAndUpdate(
        id,
        {
          $push: { comments: newComment },
        },
        { new: true },
      )
      .exec();

    if (updatedPost) {
      return {
        message: 'Comment added successfully',
        status: 200,
        data: updatedPost,
      };
    }

    return {
      message: 'Failed to add comment',
      status: 500,
      data: null,
    };
  }

  async deleteComment(
    id: string,
    commentId: string,
  ): Promise<{ message: string; status: number; data: Post | null }> {
    const post = await this.postModel.findById(id).exec();

    if (!post) {
      return {
        message: `Post with ID ${id} not found`,
        status: 404,
        data: null,
      };
    }

    // Find the comment by commentId and remove it from the comments array
    const updatedPost = await this.postModel
      .findByIdAndUpdate(
        id,
        {
          $pull: { comments: { commentId: commentId } }, // Remove the comment with the given commentId
        },
        { new: true },
      )
      .exec();

    if (updatedPost) {
      return {
        message: 'Comment deleted successfully',
        status: 200,
        data: updatedPost,
      };
    }

    return {
      message: 'Failed to delete comment',
      status: 500,
      data: null,
    };
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
