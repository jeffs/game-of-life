# Game of Life

Following along with the [Rust and WebAssembly book][book].

See init.zsh for a record of what I've done so far.  From the book:

> Anytime you make changes and want them reflected on http://localhost:8080/,
> just re-run the wasm-pack build command within the wasm-game-of-life
> directory.

Rebuilding the Rust code this way automatically hot-reloads the page.

[book]: https://rustwasm.github.io/docs/book/introduction.html

Useful commands:

```sh
wasm-pack build
wasm-pack test --chrome --headless # or --firefox, --safari, --node
npm start
```

Pro tips:

* Call `console_error_panic_hook::set_once()` to forward panic! args to console
  - [Debugging](https://rustwasm.github.io/docs/book/reference/debugging.html)

Relevant links to explore after completing this tutorial:

* [The `wasm-bindgen` Guide](https://rustwasm.github.io/docs/wasm-bindgen/introduction.html)
* [js-sys](https://crates.io/crates/js-sys)
* [Debugging Rust-Generated WebAssembly](https://rustwasm.github.io/docs/book/reference/debugging.html)
