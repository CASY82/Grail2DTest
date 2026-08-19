/**
 * 의식실에서 옥색 상자가 열린 뒤(boxOpened) 플레이어의 조작권이 서서히 사라지는 감쇠.
 * 원문 근거: "루카스는 일어서려 했지만 몸이 움직이지 않았다. 방의 공기 자체가 그의 힘을 빨아들이고 있었다."
 * 감쇠 시상수는 3.5초 — 클라이맥스 비트(레지널드 → 상자 → 안치 → 저항 → 각성) 사이를 걸어 이동하는
 * 수 초 안에 실제로 체감되도록 잡았다(12초 곡선은 도달 거리가 짧아 전혀 느껴지지 않았다).
 */
export class RitualSequenceService {
    elapsed = 0;
    update(player, dt, active) {
        if (!active) {
            player.controlMultiplier = 1;
            return;
        }
        this.elapsed += dt;
        player.controlMultiplier = Math.max(0.12, 1 - this.elapsed / 3.5);
    }
    /** 1초만 지나도 몸은 이미 자기 것이 아니다 — 4초 기준은 사실상 도달 불가한 데드 브랜치였다. */
    get agencyLocked() { return this.elapsed >= 1; }
}
