import { useLocation } from "@tanstack/react-router";
import { CustomLinkProps } from "../../CustomLink";

type Breadcrumb = {
    label: string;
    to: CustomLinkProps['to'];
}

export const useBreadcrumbs = () => {
// ** global state ** //
const pathname = useLocation({
    select: (state) => state.pathname,
})

const segments = pathname.split('/').filter(Boolean);

const breadcrumbs: Breadcrumb[] = segments.map((segment, index) => {
    const to = `/${segments.slice(0, index + 1).join('/')}`;
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    return { label, to };
});

// ** local state ** //

// ** local vars ** //

// ** handlers ** //
    return (
        <div>
            
        </div>
    );
};