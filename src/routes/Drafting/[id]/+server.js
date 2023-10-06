import { prisma } from '$lib/server/db';
import { json } from '@sveltejs/kit';

export async function GET({params}) {
    const draft = await prisma.draftplanning.findFirst({where: {draftid: parseInt(params.id)}, include: {opponent: true}})
    return json(draft);
}