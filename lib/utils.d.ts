import { AnyResponse } from "@octokit/rest";
export declare function identity<T>(v: T): T;
export declare function groupBy<TItem>(keyFn: (item: TItem) => string, list: TItem[]): {
    [key: string]: TItem[];
};
export declare function groupByLast<TItem>(keyFn: (item: TItem) => string, list: TItem[]): {
    [key: string]: TItem;
};
export declare function groupByLastMap<TItem, TValue>(keyFn: (item: TItem) => string, valueFn: (item: TItem) => TValue, list: TItem[]): {
    [key: string]: TValue;
};
/**
 * Checks the supplied response for errors and casts response data to
 * supplied type.
 * @param response The response from a GitHub API
 */
export declare function result<TResult = void>(response: AnyResponse): TResult;
