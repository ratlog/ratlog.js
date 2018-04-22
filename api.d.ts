/**
 * The default export is a function to create a logger.
 *
 * All it does is returning a log function bound to a writable stream.
 *
 * _Example:_
 *
 * ```
 * const ratlog = require('ratlog')
 * const log = ratlog(process.stdout)
 * ```
 *
 * The logger can also be directly created with one or more tags:
 *
 * ```
 * const critical = ratlog(process.stderr, 'warn', 'critical')
 * critical('oh no!')
 * // => [warn|critical] oh no!
 * ```
 */
type InitRatlog = (stream: Writable, ...tags: Stringable[]) => Ratlog;

declare const initRatlog: InitRatlog;
export default initRatlog;

/**
 * Ratlog tries its best to get a string representation of values passed to it.
 *
 * If possible values should be passed as strings directly.
 * Otherwise Ratlog tries calling `.toString()` on the given value.
 *
 * Errors are catched in case that fails. Logging should never fail.
 * But it is not pretty.
 *
 * `null` and `undefined` are converted to an empty string.
 */
export type Stringable = string | ToString;

/**
 * Ratlog is the main logging function.
 */
export interface Ratlog {
  /**
   * Mostly you are simply using Ratlog as a function that you call to log something.
   *
   * Ratlog takes a *message*, an object of *fields* and a rest of *tags*.
   *
   * No argument is required, but the typings force you to at least provide a message.
   * That is a good practise because an empty log line is mostly meaningless.
   *
   * `fields` and `tags` are optional:
   *
   * ```
   * log('hey there')
   * ```
   *
   * If you want to add tags but no fields, you omit the fields:
   *
   * ```
   * log('msg', 'mytag')
   * ```
   *
   */
  (
    message: Stringable,
    fields?: { [key: string]: Stringable },
    ...tags: Stringable[]
  ): void;

  /**
   * `.tag()` returns a new logger bound to one or more tags.
   *
   * The returned `Ratlog` workes identically to described above with the only difference that some tags are always set.
   */
  tag: (...tags: Stringable[]) => Ratlog;
}

/**
 * `ToString` is automatically implemented by any object with a `.toString()` method.
 *
 * Most JavaScript values already implement it by default,
 * but if you have complex data types,
 * you can create your own implementation to
 * create a more readable representation.
 */
export interface ToString {
  toString: () => string;
}

/**
 * `Writable` is a narrow interface for the stream passed to the Ratlog constructor.
 *
 * In practise you would mostly want to pass a stream like `process.stdout`
 * but having this narrow interface allows you to
 * easily create mock versions for testing and so on.
 */
export interface Writable {
  write: (s: string) => void;
}
