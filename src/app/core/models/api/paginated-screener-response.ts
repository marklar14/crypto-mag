import { MultiTimeframeData } from './screener-result';

export class PaginatedScreenerResponse {
  data!: MultiTimeframeData[];
  pagination!: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
