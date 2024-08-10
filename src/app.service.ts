import { Injectable } from '@nestjs/common';

export interface GetHelloResponse {
  title: string;
  description: string;
  author: {
    name: string;
    avatar: string;
  };
  version: string;
  date: Date;
  supportContact: string;
  socialLinks: {
    twitter: string;
    linkedin: string;
    hashnode: string;
    githubIssues: string;
  };
}
@Injectable()
export class AppService {
  getHello(): GetHelloResponse {
    return {
      title: 'Nestjs Auth',
      description:
        'A secure and scalable user authentication system implemented using NestJS, MongoDB, and JWT. It supports user registration, login, role-based access control, and token-based authentication.',
      author: {
        name: 'Hammed Anuolwapo Pelumi (Phastboy)',
        avatar: 'https://avatars.githubusercontent.com/u/75147299?v=4',
      },
      version: '1.0.0',
      date: new Date(),
      supportContact: 'stationphast@gmail.com',
      socialLinks: {
        twitter: 'https://twitter.com/Phastboy',
        linkedin: 'https://www.linkedin.com/in/hammed-anuolwapo-0b9b7b1b4/',
        hashnode: 'https://phastboy.hashnode.dev/',
        githubIssues: 'https://www.github.com/Phastboy/auth/issues',
      },
    };
  }
}
