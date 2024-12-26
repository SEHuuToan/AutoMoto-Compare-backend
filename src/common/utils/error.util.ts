import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

export function handleMongoError(error: any): never {
  if (error?.name === 'MongoServerError' && error?.code === 11000) {
    const duplicateField = Object.keys(error.keyValue || {})[0];
    throw new ConflictException(`${duplicateField || 'Field'} already exists.`);
  }
  throw new InternalServerErrorException('An unexpected error occurred.');
}
