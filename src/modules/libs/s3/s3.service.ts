import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import {
  DeleteObjectCommand,
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3'

@Injectable()
export class S3Service {
  private readonly client: S3Client
  private readonly bucket: string

  constructor(private readonly configService: ConfigService) {
    this.client = new S3Client({
      endpoint: configService.getOrThrow<string>('S3_ENDPOINT'),
      region: configService.getOrThrow<string>('S3_REGION'),
      credentials: {
        accessKeyId: configService.getOrThrow<string>('MINIO_USER'),
        secretAccessKey: configService.getOrThrow<string>('MINIO_PASSWORD'),
      },
      forcePathStyle: true,
    })

    this.bucket = configService.getOrThrow<string>('S3_BUCKET')
  }

  async upload(buffer: Buffer, key: string, mimetype: string) {
    const command: PutObjectCommandInput = {
      Bucket: this.bucket,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
    }

    try {
      await this.client.send(new PutObjectCommand(command))
    } catch (e) {
      throw e
    }
  }

  async remove(key: string) {
    const command: PutObjectCommandInput = {
      Bucket: this.bucket,
      Key: key,
    }

    try {
      await this.client.send(new DeleteObjectCommand(command))
    } catch (e) {
      throw e
    }
  }
}
