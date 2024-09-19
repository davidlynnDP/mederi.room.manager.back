import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CommonService {
    
    private readonly logger = new Logger('CommonService');

    globalErrorHandler(error: any): void {

        console.log(error)
        this.logger.error(error);

        // switch (error.code) {

        //     //custom errors

        //     default:
        //         throw new InternalServerErrorException('Unexpected error, check the server logs!');
        // }
    }
}
