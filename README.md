# bit-face

Pseudorandom pixel art avatar generator.

![avatars examples](https://raw.githubusercontent.com/Nemethe/bit-face/master/examples.png)

## Usage

```
import getAvatar form "bit-face";

await getAvatar('seed_1337', 1);
// return data:image/png;base64 ...
```

The second argument is gender.\
1 - male\
2 - female

```
img {
  image-rendering: pixelated;
}
```

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details
