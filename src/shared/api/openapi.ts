import { ApiError } from '@/shared/api/shared';

export interface ApiEnvelope<T = unknown> {
  success?: boolean;
  error?: string | null;
  content?: T | null;
}

export interface OpenApiResult {
  data?: unknown;
  error?: unknown;
  response: Response;
}

function getErrorMessage(payload: unknown, fallback: string) {
  if (typeof payload !== 'object' || payload === null) return fallback;

  if ('error' in payload && typeof payload.error === 'string') {
    return payload.error;
  }

  if ('message' in payload && typeof payload.message === 'string') {
    return payload.message;
  }

  return fallback;
}

function requireSuccessfulEnvelope(result: OpenApiResult) {
  const payload = result.data ?? result.error;
  const envelope = result.data as ApiEnvelope | null | undefined;

  if (
    !result.response.ok ||
    typeof envelope !== 'object' ||
    envelope === null ||
    !('content' in envelope)
  ) {
    throw new ApiError(
      getErrorMessage(payload, result.response.statusText || 'API 요청에 실패했습니다.'),
      result.response.status,
      payload,
    );
  }

  const apiEnvelope = envelope as ApiEnvelope;

  if (apiEnvelope.success === false) {
    throw new ApiError(
      getErrorMessage(payload, result.response.statusText || 'API 요청에 실패했습니다.'),
      result.response.status,
      payload,
    );
  }

  return apiEnvelope;
}

export function unwrapOpenApiContent<T>(result: OpenApiResult): NonNullable<T> {
  const envelope = requireSuccessfulEnvelope(result);

  if (envelope.content === null || envelope.content === undefined) {
    throw new ApiError('API 응답에 필요한 내용이 없습니다.', result.response.status, envelope);
  }

  return envelope.content as NonNullable<T>;
}

export function unwrapOpenApiVoid(result: OpenApiResult): void {
  requireSuccessfulEnvelope(result);
}

export async function unwrapResponseContent<T>(response: Response): Promise<NonNullable<T>> {
  const payload = await response.json().catch(() => null);
  return unwrapOpenApiContent<T>({
    data: response.ok ? payload : undefined,
    error: response.ok ? undefined : payload,
    response,
  });
}
