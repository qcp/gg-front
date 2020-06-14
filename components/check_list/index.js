export default {
    name: "Check list",
    sysname: "check_list",

    admin: () => import("./Admin"),
    defaultSettings: () => ({
        title: "",
        subtitle: "",
        variants: []
    }),

    examinee: () => import("./Examinee"),
    reviewer: () => import("./Reviewer"),
    defaultAnswer: (settings) => ({
        choice: settings.variants.map(() => false)
    })
}