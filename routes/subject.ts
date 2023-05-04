import { Hono } from "hono"
import { getAllSubjects, deleteSubject, getSubject, insertSubject, updateSubject } from "../utils/db/subject.ts"
import { Respond, Bindings, Variables } from '../utils/types.ts'
import { BAD_REQUEST_STATUS_CODE, SERVER_ERROR_STATUS_CODE, DEFAULT_PARAM } from '../utils/constants.ts'

const subjectRouter = new Hono<{ Bindings: Bindings; Variables: Variables }>()

//! Get all subject
subjectRouter.get("/", async (c) => {
    try {
        const subjects = await getAllSubjects();
        return c.json<Respond>({
            status: "success",
            data: subjects,
            responseTime: Date.now()
        });
    } catch (error) {
        c.status(SERVER_ERROR_STATUS_CODE)
        return c.json<Respond>({
            status: "error",
            message: error.toString(),
            responseTime: Date.now()
        })
    }
});

//! Add new subject
subjectRouter.post("/", async (c) => {
    try {
        const body = await c.req.json();
        if (!body?.title) {
            c.status(BAD_REQUEST_STATUS_CODE);
            return c.json<Respond>({
                status: "error",
                message: "title is required!",
                responseTime: Date.now()
            })
        }

        const subjectId = await insertSubject(body.title);
        if (subjectId) {
            return c.json<Respond>({
                status: "success",
                message: "Subject id : " + subjectId,
                responseTime: Date.now()
            })
        }
    } catch (error) {
        c.status(SERVER_ERROR_STATUS_CODE)
        return c.json<Respond>({
            status: "error",
            message: error.toString(),
            responseTime: Date.now()
        })
    }
})

//! Get single subject
subjectRouter.get("/:id", async (c) => {
    try {
        const id = await c.req.param("id") ?? DEFAULT_PARAM;
        const subject = await getSubject(id)
        if (subject) {
            return c.json<Respond>({
                status: "success",
                data: subject,
                responseTime: Date.now()
            })
        } else {
            c.status(BAD_REQUEST_STATUS_CODE)
            return c.json<Respond>({
                status: "error",
                message: "Subject not found!",
                responseTime: Date.now()
            })
        }
    } catch (error) {
        c.status(SERVER_ERROR_STATUS_CODE)
        return c.json<Respond>({
            status: "error",
            message: error.toString(),
            responseTime: Date.now()
        })
    }
})

//! Update single subject
subjectRouter.put("/:id", async (c) => {
    try {
        const id = await c.req.param("id") ?? DEFAULT_PARAM
        const body = await c.req.json()
        if (!body.title) throw new Error("Title is requires")

        const isUpdated = await updateSubject(id, {
            title: body.title
        });
        if (isUpdated) {
            return c.json<Respond>({
                status: "success",
                message: id + " subject is updated!",
                responseTime: Date.now()
            })
        }
    } catch (error) {
        c.status(SERVER_ERROR_STATUS_CODE)
        return c.json<Respond>({
            status: "error",
            message: error.toString(),
            responseTime: Date.now()
        })
    }
})

//! Delete subject
subjectRouter.delete("/", async (c) => {
    try {
        const { id } = await c.req.json()
        if (!id) throw new Error("id is required!");
        const isDeleted = await deleteSubject(id);
        if (isDeleted) {
            return c.json<Respond>({
                status: "success",
                message: "subject is deleted!",
                responseTime: Date.now()
            })
        } else {
            c.status(BAD_REQUEST_STATUS_CODE)
            return c.json<Respond>({
                status: "error",
                message: "subject is not deleted!",
                responseTime: Date.now()
            })
        }
    } catch (error) {
        c.status(SERVER_ERROR_STATUS_CODE)
        return c.json<Respond>({
            status: "error",
            message: error.toString(),
            responseTime: Date.now()
        })
    }
})
export default subjectRouter;