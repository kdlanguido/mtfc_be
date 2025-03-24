import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Product } from 'schemas/product.schema';
import { Model } from 'mongoose';

@Injectable()
export class ProductsService {

  constructor(@InjectModel(Product.name) private productModel: Model<Product>) { }

  async create(createProductDto: CreateProductDto): Promise<{ message: string; product: Product }> {
    try {
      const createdProduct = new this.productModel(createProductDto);
      const savedProduct = await createdProduct.save();

      return { message: "Product created successfully", product: savedProduct };
    } catch (error) {
      throw new BadRequestException("Failed to create product");
    }
  }


  findAll() {
    return this.productModel.find().sort({ _id: -1 }).exec();
  }

  async findOne(productId: string) {
    try {

      const Product = await this.productModel.findById(productId).exec();

      if (!Product) {
        throw new NotFoundException('Product not found');
      }

      return Product;

    } catch (error) {
      throw new BadRequestException('Error during product retrieval');
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto): Promise<{ message: string; product?: Product }> {
    try {
      const updatedProduct = await this.productModel.findByIdAndUpdate(
        id,
        updateProductDto,
        {
          new: true,
          runValidators: true,
        }
      ).exec();

      if (!updatedProduct) {
        return { message: `Product with id ${id} not found` };
      }

      return { message: "Product updated successfully", product: updatedProduct };

    } catch (error) {
      throw new BadRequestException("Error updating product");
    }
  }


  async remove(id: string): Promise<Product> {

    const deletedProduct = await this.productModel.findByIdAndDelete(id).exec();

    if (!deletedProduct) {
      throw new Error(`Product with id ${id} not found`);
    }

    return deletedProduct;
  }
}
