#include "../physics.h"
#include <assert.h>
#include <stdio.h>
int main(void) {
    assert(move_bounded(1, -30, 1, 100, 20) == 0);
    assert(move_bounded(90, 30, 1, 100, 20) == 80);
    assert(rectangles_overlap((Rect){0, 0, 10, 10}, (Rect){9, 9, 5, 5}));
    assert(!rectangles_overlap((Rect){0, 0, 10, 10}, (Rect){10, 0, 5, 5}));
    uint32_t a = 42, b = 42;
    for (int i = 0; i < 20; ++i) assert(next_random(&a) == next_random(&b));
    assert(spawn_x(&a, 100, 20) <= 80);
    puts("physics tests passed");
}
