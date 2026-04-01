import NextLink from "next/link";
import { useRouter } from "next/router";
import type { ParsedUrlQuery } from "querystring";
import React, { forwardRef, useCallback, useEffect, useMemo } from "react";

type NavigateOptions = {
  replace?: boolean;
};

type SearchParamValue = string | string[];
type SearchParamsInit =
  | string
  | URLSearchParams
  | Record<string, string | string[] | null | undefined>
  | Array<[string, string]>;

type InternalLinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
  prefetch?: boolean;
  replace?: boolean;
  scroll?: boolean;
  shallow?: boolean;
};

const EXTERNAL_PROTOCOL_RE = /^[a-z][a-z\d+\-.]*:/i;

const toLocationLike = (asPath: string) => {
  const [pathWithQuery, hashPart] = asPath.split("#");
  const [pathname, queryString] = pathWithQuery.split("?");

  return {
    pathname: pathname || "/",
    search: queryString ? `?${queryString}` : "",
    hash: hashPart ? `#${hashPart}` : "",
    state: null,
    key: asPath,
  };
};

const isExternalHref = (href: string) => {
  if (href.startsWith("//")) return true;
  if (href.startsWith("mailto:")) return true;
  if (href.startsWith("tel:")) return true;
  return EXTERNAL_PROTOCOL_RE.test(href);
};

const queryToSearchParams = (query: ParsedUrlQuery) => {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => {
        if (entry != null) params.append(key, entry);
      });
      return;
    }

    if (value != null) {
      params.set(key, String(value));
    }
  });

  return params;
};

const toSearchParams = (nextInit: SearchParamsInit) => {
  if (typeof nextInit === "string") {
    return new URLSearchParams(nextInit);
  }

  if (nextInit instanceof URLSearchParams) {
    return new URLSearchParams(nextInit.toString());
  }

  if (Array.isArray(nextInit)) {
    return new URLSearchParams(nextInit);
  }

  const params = new URLSearchParams();
  Object.entries(nextInit).forEach(([key, value]) => {
    if (Array.isArray(value)) {
      value.forEach((entry) => params.append(key, entry));
      return;
    }

    if (value != null) {
      params.set(key, value);
    }
  });

  return params;
};

export const Link = forwardRef<HTMLAnchorElement, InternalLinkProps>(function LinkCompat(
  { to, prefetch, replace, scroll, shallow, ...props },
  ref
) {
  if (isExternalHref(to)) {
    return <a ref={ref} href={to} {...props} />;
  }

  return (
    <NextLink
      ref={ref}
      href={to}
      prefetch={prefetch}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
      {...props}
    />
  );
});

export type NavLinkProps = Omit<InternalLinkProps, "className"> & {
  className?: string | ((state: { isActive: boolean; isPending: boolean; isTransitioning: boolean }) => string);
};

export const NavLink = forwardRef<HTMLAnchorElement, NavLinkProps>(function NavLinkCompat(
  { to, className, ...props },
  ref
) {
  const router = useRouter();
  const currentPath = toLocationLike(router.asPath || "/").pathname;
  const linkPath = toLocationLike(to).pathname;
  const isActive = currentPath === linkPath;

  const computedClassName =
    typeof className === "function"
      ? className({ isActive, isPending: false, isTransitioning: false })
      : className;

  return <Link ref={ref} to={to} className={computedClassName} {...props} />;
});

export const useNavigate = () => {
  const router = useRouter();

  return useCallback(
    (to: string | number, options?: NavigateOptions) => {
      if (typeof to === "number") {
        if (to === -1) {
          router.back();
          return;
        }

        if (typeof window !== "undefined") {
          window.history.go(to);
        }

        return;
      }

      if (options?.replace) {
        void router.replace(to);
        return;
      }

      void router.push(to);
    },
    [router]
  );
};

export const useLocation = () => {
  const router = useRouter();
  const asPath = router.asPath || "/";

  return useMemo(() => toLocationLike(asPath), [asPath]);
};

export const useParams = <TParams extends Record<string, string | undefined> = Record<string, string>>() => {
  const router = useRouter();

  return useMemo(() => {
    const params: Record<string, string> = {};

    Object.entries(router.query).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        params[key] = value[0] ?? "";
        return;
      }

      if (value != null) {
        params[key] = String(value);
      }
    });

    return params as TParams;
  }, [router.query]);
};

export const useSearchParams = (): [URLSearchParams, (nextInit: SearchParamsInit, options?: NavigateOptions) => void] => {
  const router = useRouter();

  const searchParams = useMemo(() => queryToSearchParams(router.query), [router.query]);

  const setSearchParams = useCallback(
    (nextInit: SearchParamsInit, options?: NavigateOptions) => {
      const nextSearch = toSearchParams(nextInit).toString();
      const pathname = toLocationLike(router.asPath || "/").pathname;
      const href = nextSearch ? `${pathname}?${nextSearch}` : pathname;

      if (options?.replace) {
        void router.replace(href);
        return;
      }

      void router.push(href);
    },
    [router]
  );

  return [searchParams, setSearchParams];
};

export function Navigate({ to, replace = false }: { to: string; replace?: boolean; state?: unknown }) {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(to, { replace });
  }, [navigate, replace, to]);

  return null;
}

export function Outlet({ children }: { children?: React.ReactNode }) {
  return <>{children ?? null}</>;
}

export function BrowserRouter({ children }: { children?: React.ReactNode; [key: string]: unknown }) {
  return <>{children}</>;
}

export function Routes({ children }: { children?: React.ReactNode }) {
  return <>{children}</>;
}

export function Route(_props: Record<string, unknown>) {
  return null;
}
