#include "physics.h"
#include <stdio.h>
#include <stdlib.h>
int main(int argc, char **argv) {
    uint32_t state = argc > 1 ? (uint32_t)strtoul(argv[1], NULL, 10) : 42u;
    float player = 200.0f;
    for (int tick = 0; tick < 10; ++tick) {
        player = move_bounded(player, tick % 2 ? -90.0f : 90.0f, 0.2f, 480.0f, 32.0f);
        float parcel = spawn_x(&state, 480.0f, 24.0f);
        printf("tick %d player %.1f parcel %.1f collision %s\n", tick, player, parcel,
            rectangles_overlap((Rect){player, 420, 32, 32}, (Rect){parcel, 420, 24, 24}) ? "yes" : "no");
    }
    return 0;
}
