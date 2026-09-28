#include "physics.h"
float move_bounded(float x, float velocity, float elapsed, float width, float object_width) {
    float next = x + velocity * elapsed;
    if (next < 0.0f) return 0.0f;
    if (next > width - object_width) return width - object_width;
    return next;
}
int rectangles_overlap(Rect a, Rect b) {
    return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
uint32_t next_random(uint32_t *state) {
    // use a fixed seed when zero is supplied
    if (*state == 0) *state = 0x6d2b79f5u;
    uint32_t x = *state;
    x ^= x << 13;
    x ^= x >> 17;
    x ^= x << 5;
    *state = x;
    return x;
}
float spawn_x(uint32_t *state, float width, float object_width) {
    if (width <= object_width) return 0.0f;
    return (float)(next_random(state) % 10000u) / 9999.0f * (width - object_width);
}
