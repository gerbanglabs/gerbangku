module.exports = [
"[project]/src/app/(store)/[slug]/layout.tsx [app-rsc] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SlugLayout,
    "generateMetadata",
    ()=>generateMetadata
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/rsc/react-jsx-dev-runtime.js [app-rsc] (ecmascript)");
;
const API_BASE = ("TURBOPACK compile-time value", "http://localhost:9000/api/v1") || 'http://localhost:3000/api/v1';
async function generateMetadata({ params }) {
    try {
        const res = await fetch(`${API_BASE}/public/business/${params.slug}/info`, {
            next: {
                revalidate: 3600
            }
        });
        const data = await res.json();
        if (data.success && data.data) {
            const biz = data.data;
            return {
                title: `${biz.name} — Toko Online`,
                description: biz.description || `Belanja produk dari ${biz.name}, ${biz.city || 'Bali'}`,
                openGraph: {
                    title: biz.name,
                    description: biz.description || `Belanja dari ${biz.name}`,
                    type: 'website',
                    locale: 'id_ID'
                }
            };
        }
    } catch  {}
    return {
        title: 'Toko Online — Gerbangku',
        description: 'Belanja produk UMKM Bali berkualitas'
    };
}
function SlugLayout({ children }) {
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$rsc$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$rsc$5d$__$28$ecmascript$29$__["Fragment"], {
        children: children
    }, void 0, false);
}
}),
"[project]/src/app/(store)/[slug]/layout.tsx [app-rsc] (ecmascript, Next.js Server Component)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/src/app/(store)/[slug]/layout.tsx [app-rsc] (ecmascript)"));
}),
];

//# sourceMappingURL=src_app_%28store%29_%5Bslug%5D_layout_tsx_0803d94._.js.map