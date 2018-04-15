type stringable = string | { toString: () => string }

export interface RatlogInterface {
  (message: string, fields?: { [key: string]: stringable }, ...callTags: stringable[]): void

    tag: (...additionalTags: stringable[]) => RatlogInterface
}


interface WriteInterface {
  write: (s: string) => void
}

interface InitInterface {
  (stream: WriteInterface, ...initTags: stringable[]): RatlogInterface
}

declare const init: InitInterface
export default init
