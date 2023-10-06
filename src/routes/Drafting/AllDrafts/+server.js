import { prisma } from '$lib/server/db';
import { json } from '@sveltejs/kit';

export async function GET() {
    const drafts = await prisma.draftplanning.findMany({include: {opponent: true}})
    //console.log(teams)
    return json(drafts);
}