import {createNavigation} from 'next-intl/navigation';
import {routing} from './../i18n/routing';
import {useSearchParams as useNextSearchParams} from 'next/navigation';

export const {Link, useRouter, usePathname, redirect} = createNavigation(routing);
export const useSearchParams = useNextSearchParams;
