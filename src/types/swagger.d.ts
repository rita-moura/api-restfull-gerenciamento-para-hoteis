/**
 * Tipos personalizados para Swagger UI
 * Extensão dos tipos do swagger-ui-express para melhor compatibilidade
 */

declare module 'swagger-ui-express' {
  export interface SwaggerUiOptions {
    customCss?: string;
    customCssUrl?: string | string[];
    customJs?: string | string[];
    customfavIcon?: string;
    swaggerOptions?: {
      [key: string]: any;
      persistAuthorization?: boolean;
      displayRequestDuration?: boolean;
      docExpansion?: 'list' | 'full' | 'none';
      filter?: boolean | string;
      showExtensions?: boolean;
      showCommonExtensions?: boolean;
      urls?: Array<{ url: string; name: string }>;
      url?: string;
      spec?: object;
      validatorUrl?: string | null;
      oauth?: {
        clientId?: string;
        clientSecret?: string;
        realm?: string;
        appName?: string;
        scopeSeparator?: string;
        scopes?: string | string[];
        additionalQueryStringParams?: object;
        useBasicAuthenticationWithAccessCodeGrant?: boolean;
        usePkceWithAuthorizationCodeGrant?: boolean;
      };
      preauthorizeBasic?: {
        username: string;
        password: string;
      };
      preauthorizeApiKey?: {
        authDefinitionKey: string;
        apiKeyValue: string;
      };
    };
    customSiteTitle?: string;
    explorer?: boolean;
    isExplorer?: boolean;
    swaggerUrls?: Array<{ url: string; name: string }>;
    customJsStr?: string;
  }

  export interface SwaggerOptions {
    [key: string]: any;
  }

  export function serve(arg0: string, serve: any, arg2: any) {
    throw new Error('Function not implemented.');
  }
}