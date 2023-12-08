class ApiResponse {
  statusCode: number;
  data: null | any[];
  message: string;
  sucess: boolean;

  constructor(statusCode: number, data: null | any, message = "Sucess") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.sucess = this.statusCode < 400;
  }
}

export default ApiResponse;
