import { Endorsement } from '../../types/schema'
import { constituencyMapper, EndorsementListTags } from '../../constants'
export const PAGE_SIZE = 10

export function paginate(
  endorsements: Endorsement[] | undefined,
  page_size: number,
  page_number: number,
) {
  if (endorsements === undefined) return
  else {
    return endorsements.slice(
      (page_number - 1) * page_size,
      page_number * page_size,
    )
  }
}

export function totalPages(endorsementsLength: number | undefined) {
  if (endorsementsLength === undefined) return 0
  else {
    return Math.ceil(endorsementsLength / PAGE_SIZE)
  }
}

export function minAndMaxEndorsements(constituency: EndorsementListTags) {
  const max = 5
    /*constituencyMapper[constituency as EndorsementListTags]
      .parliamentary_seats * 40*/
  const min =
    constituencyMapper[constituency as EndorsementListTags]
      .parliamentary_seats * 30
  return { min, max }
}
