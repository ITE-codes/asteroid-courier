#ifndef COURIER_PHYSICS_H
#define COURIER_PHYSICS_H
#include <stdint.h>
typedef struct { float x, y, w, h; } Rect;
float move_bounded(float x, float velocity, float elapsed, float width, float object_width);
int rectangles_overlap(Rect a, Rect b);
uint32_t next_random(uint32_t *state);
float spawn_x(uint32_t *state, float width, float object_width);
#endif
