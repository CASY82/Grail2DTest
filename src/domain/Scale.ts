/** LDD v2.0 기준 환산값. 월드 거리와 m 단위 시스템은 이 값만 사용한다. */
export const PIXELS_PER_METER = 45.8;

export const metersToPixels = (meters: number): number => meters * PIXELS_PER_METER;
