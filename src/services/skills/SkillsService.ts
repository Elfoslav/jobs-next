'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import SkillsStore from './SkillsStore'
import Skill from '@/models/Skill'
import { SKILLS_QUERY_NAME } from '@/lib/consts'

const skillsStore = new SkillsStore()

const getSkills = async (): Promise<Skill[]> => {
  // const response = await axios.get<Skill[]>(API_URL)
  // return response.data
  const data: Skill[] = skillsStore.read()

  return Promise.resolve(data)
}

const getSkillsCount = async (): Promise<number> => {
  const data: Skill[] = skillsStore.read()
  return Promise.resolve(data.length)
}

const getSkillById = async (id: string): Promise<Skill | null> => {
  // const response = await axios.get<Skill[]>(API_URL)
  // return response.data
  const skills: Skill[] = skillsStore.read()
  const skill = skills.find((skill) => skill.id === id) || null

  return Promise.resolve(skill)
}

const createSkill = async (newSkill: Skill): Promise<void> => {
  // await axios.post(API_URL, newSkill)
  // data.push(newSkill)
  skillsStore.create(newSkill)
}

const updateSkill = async (updatedSkill: Skill): Promise<void> => {
  // await axios.put(`${API_URL}/${updatedSkill.id}`, updatedSkill)
  skillsStore.update(updatedSkill.id, updatedSkill)
}

const deleteSkill = async (skillId: string): Promise<void> => {
  skillsStore.delete(skillId)
}

export const useGetSkills = () => {
  const result = useQuery<Skill[], unknown>([SKILLS_QUERY_NAME], async () => {
    return await getSkills()
  })
  return { ...result, count: result.data?.length }
}

export const useGetSkillsCount = (searchQuery: string = '', skills: string[] = []) => {
  const result = useQuery<number, unknown>(['skills_count', searchQuery, skills], () => getSkillsCount())
  return { ...result }
}

export const useGetSkillById = (skillId: string) => {
  const result = useQuery<Skill | null, unknown>(['skill', skillId], () => getSkillById(skillId));
  return result;
}

export const useCreateSkill = () => {
  const queryClient = useQueryClient()

  return useMutation<void, unknown, Skill>(createSkill, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [SKILLS_QUERY_NAME] })
    },
  })
}

export const useUpdateSkill = () => {
  const queryClient = useQueryClient()

  return useMutation<void, unknown, Skill>(updateSkill, {
    onSuccess: () => {
      queryClient.invalidateQueries([])
    },
  })
}

export const useDeleteSkill = () => {
  const queryClient = useQueryClient()

  return useMutation<void, unknown, string>(deleteSkill, {
    onSuccess: () => {
      queryClient.invalidateQueries([])
    },
  })
}