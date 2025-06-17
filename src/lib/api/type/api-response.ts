export default interface ApiResponse<T> {
  success: boolean;
  error: string | null;
  content: T | null;
}
