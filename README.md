# Asteroid Courier

A small arcade game: pilot a courier through falling asteroids, collect glowing parcels, and survive as the pace increases. Movement uses A/D or left/right arrows; Space starts or restarts. Touch buttons work on mobile. Score and best score persist in your browser.

## Run

Open `public/index.html` directly in a browser. No build or network connection required.

## C simulation

The `physics.c` module provides the same useful core idea in native C: bounded motion, rectangle overlap, and deterministic seeded spawning. Run its test and CLI demo with:

```sh
gcc -std=c11 -Wall -Wextra -Werror physics.c tests/test_physics.c -o /tmp/asteroid-test && /tmp/asteroid-test
gcc -std=c11 -Wall -Wextra -Werror physics.c sim.c -o /tmp/asteroid-sim && /tmp/asteroid-sim 42
```

The browser game is implemented in JavaScript; the C module is a separate simulation exercise, not a WebAssembly build. Future ideas: levels, sound, gamepad support, or compiling the shared physics to WebAssembly.
