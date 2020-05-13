export default {
    name: "Awards",
    sysname: "awards",

    admin: () => import("./Admin"),
    defaultSettings: () => ({
        allowMultiple: false,
        allowFormats: []
    }),

    examinee: () => import("./Examinee"),
    reviewer: () => import("./Reviewer"),
    defaultAnswer: () => ({
        files: []
    })
}