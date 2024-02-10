import { UseQuery, UseQueryStateOptions } from '@reduxjs/toolkit/dist/query/react/buildHooks'
import { QueryDefinition } from '@reduxjs/toolkit/query'
import { useEffect, useState } from 'react'

export function useGetInfiniteListQuery<T>(
	useQueryHook: UseQuery<QueryDefinition<any, any, any, any>>,
	searchParams: any = {},
	options?: UseQueryStateOptions<any, any>
) {
	const [page, setPage] = useState<number>(searchParams?.page ?? 1)
	let { data, ...rest } = useQueryHook({ ...searchParams, page }, options)
	const [items, setItems] = useState<T[] | null>(null)

	const hasMore = !!data?.nextPage

	function loadMore() {
		if (hasMore) setPage(data.nextPage)
	}

	useEffect(() => {
		if (!data?.items || data.items.length === 0) {
			setItems([])
			return
		}

		if (page === 1) {
			setItems(() => [...data.items])
		} else if (page === data.currentPage) {
			setItems(prevItems => (prevItems ? [...prevItems, ...data.items] : data.items))
		}
	}, [data, page])

	return { hasMore, items, loadMore, setItems, data, ...rest }
}
