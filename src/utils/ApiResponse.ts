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

export class PaginateResponse {
  totalCount: number;
  data: any[];
  prevPage: number | null;
  nextPage: number | null;
  lastPage: number;

  constructor(
    totalCount: number,
    data: any,
    prevPage: null | number,
    nextPage: null | number,
    lastPage: number
  ) {
    this.totalCount = totalCount;
    this.data = data;
    this.prevPage = prevPage;
    this.nextPage = nextPage;
    this.lastPage = lastPage;
  }
}

export default ApiResponse;
