export default {
    name: "Free file list",
    sysname: "free_file_list",

    admin: () => import("./Admin"),
    defaultSettings: () => ({
        title: "",
        subtitle: "",
        allowMultiple: false,
        allowFormats: []
    }),

    examinee: () => import("./Examinee"),
    reviewer: () => import("./Reviewer"),
    defaultAnswer: () => ({
        attach: []
    })
}