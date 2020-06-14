export default {
    name: "Fixed file list",
    sysname: "fixed_file_list",

    admin: () => import("./Admin"),
    defaultSettings: () => ({
        title: "",
        subtitle: "",
        attaches: []
    }),

    examinee: () => import("./Examinee"),
    reviewer: () => import("./Reviewer"),
    defaultAnswer: (settings) => ({
        attach: settings.attaches.map(() => ({ files: [] }))
    })
}