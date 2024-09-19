import { HttpException, HttpStatus, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';

@Injectable()
export class CommonService {
    
    private readonly logger = new Logger('CommonService');

    /**
     * Maneja los errores globales de la aplicación.
     * @param error - El error capturado que se debe manejar.
     * @throws HttpException - Lanza una excepción HTTP adecuada en base al tipo de error.
     */
    globalErrorHandler(error: any): void {

        console.log(error)
        this.logger.error(error);

        switch (error.code) {

            case 'P2002':
                throw new HttpException('Conflict: Duplicado de datos.', HttpStatus.CONFLICT);

            case 'P2025':
                throw new HttpException('Not Found: Registro no encontrado.', HttpStatus.NOT_FOUND);

            default:
                throw new InternalServerErrorException(`Unexpected error, check the server logs!`);
        }
    }
}
