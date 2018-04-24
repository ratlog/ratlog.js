/**
 * The default export is a function that creates a logger.
 *
 * All it does is returning a log function bound to a writable stream or function.
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
 *
 * Optionally a transform function can be given which can modify or filter logs:
 *
 * ```
 * const log = ratlog(
 *   process.stdout,
 *   log => process.env.DEBUG || !log.tags.includes('debug') ? log : null
 * )
 * ```
 *
 * If transform returns `null` or `undefined`, the log is ignored.
 * Make sure the transform function doesn't crash and returns valid RatlogData.
 */
export type Ratlog = {
  (stream: Writer, ...tags: Stringable[]): Ratlogger;

  (
    stream: Writer,
    transform: (data: RatlogData) => RatlogData,
    ...tags: Stringable[]
  ): Ratlogger;

  /**
   * `stringify` is the helper function which does the actual work of producing a Ratlog compliant string.
   *
   * Normally it doesn't need to be used directly, but it is exposed just in case.
   */
  stringify: (log: RatlogData) => string;
};

/**
 * The default export is a function to create a logger.
 *
 * See `Ratlog` at the top of this document.
 */
declare const ratlog: Ratlog;
export default ratlog;

/**
 * Ratlogger is the main logging function.
 *
 * Ratlogger takes a *message*, an object of *fields* and a rest of *tags*.
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
 * If you want to add tags but no fields, you can omit the fields:
 *
 * ```
 * log('msg', 'mytag')
 * ```
 *
 */
export type Ratlogger = {
  (
    message: Stringable,
    fields?: { [key: string]: Stringable },
    ...tags: Stringable[]
  ): void;

  (message: Stringable, ...tags: Stringable[]): void;

  /**
   * `.tag()` returns a new logger bound to one or more tags.
   *
   * The returned Ratlogger workes identical to above with the only difference that some tags are always set.
   *
   * ```
   * const warn = log.tag('warn')
   *
   * warn('it is late')
   * // => [warn] it is late
   * ```
   */
  tag: (...tags: Stringable[]) => Ratlogger;
};

/**
 * `RatlogData` represents an unprocessed log as data.
 */
export type RatlogData = {
  message: Stringable;
  tags: Stringable[];
  fields: { [key: string]: Stringable };
};

/**
 * Ratlog tries its best to get a string representation of values passed to it.
 *
 * If possible values should be passed as strings directly.
 * Otherwise Ratlog tries calling `.toString()` on the given value.
 *
 * Errors are catched in case that fails. Logging should never fail.
 * But it is not pretty.
 *
 * `null` and `undefined` are converted to empty strings.
 */
export type Stringable = string | ToString;

/**
 * `ToString` is automatically implemented by any object with a `.toString()` method.
 *
 * Most JavaScript values already implement it by default,
 * but if you have complex data types,
 * you can create your own implementation to
 * create a more readable representation.
 */
export type ToString = {
  toString: () => string;
};

/**
 * `Writer` is a narrow interface for the stream or function passed to the Ratlog constructor.
 *
 * In practise you would mostly want to pass a stream like `process.stdout`
 * but having this narrow interface allows you to
 * easily create mock versions for testing and so on.
 *
 * By implementing your own writer, you could even use Ratlog in the browser:
 *
 * ```
 * const log = ratlog(console.log)
 * ```
 */
export type Writer =
  | { write: (logLine: string) => void }
  | ((logLine: string) => void);
