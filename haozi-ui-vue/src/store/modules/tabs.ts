import {defineStore} from 'pinia'
import {RouteLocationNormalizedLoaded} from 'vue-router'

const resolveViewName = (view: RouteLocationNormalizedLoaded): string | undefined => {
	return (view.meta?.componentName as string) || (view.name as string | undefined)
}

export const tabsStore = defineStore('tabsStore', {
	state: () => ({
		visitedViews: [] as any[],
		cachedViews: [] as any[]
	}),
	actions: {
		addView(view: RouteLocationNormalizedLoaded) {
			if (this.visitedViews.some(value => value.path === view.path)) {
				return
			}
			this.visitedViews.push(
				Object.assign({}, view, {
					title: view.meta?.title || 'unknown'
				})
			)
		},
		addCachedView(view: RouteLocationNormalizedLoaded) {
			const viewName = resolveViewName(view)
			if (!viewName || this.cachedViews.includes(viewName)) {
				return
			}

			if (view.meta.cache) {
				this.cachedViews.push(viewName)
			}
		},
		delView(view: RouteLocationNormalizedLoaded) {
			for (const [i, v] of this.visitedViews.entries()) {
				if (v.path === view.path) {
					this.visitedViews.splice(i, 1)
					break
				}
			}

			this.delCachedView(view).then()
		},
		delCachedView(view: RouteLocationNormalizedLoaded) {
			return new Promise(resolve => {
				const viewName = resolveViewName(view)
				if (!viewName) {
					resolve([...this.cachedViews])
					return
				}
				const index = this.cachedViews.indexOf(viewName)
				if (index > -1) {
					this.cachedViews.splice(index, 1)
				}
				resolve([...this.cachedViews])
			})
		},
		delOthersViews(view: RouteLocationNormalizedLoaded) {
			this.visitedViews = this.visitedViews.filter(v => {
				return v.meta.affix || v.path === view.path
			})

			const viewName = resolveViewName(view)
			if (viewName) {
				const index = this.cachedViews.indexOf(viewName)
				if (index > -1) {
					this.cachedViews = this.cachedViews.slice(index, index + 1)
				} else {
					this.cachedViews = []
				}
			} else {
				this.cachedViews = []
			}
		},
		delAllViews() {
			this.visitedViews = this.visitedViews.filter(tab => tab.meta.affix)
			this.cachedViews = []
		}
	}
})
