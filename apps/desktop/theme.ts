import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const canvasCaptureTheme: CustomThemeConfig = {
	name: 'canvas-capture-theme',
	properties: {
		// =~= Theme Properties =~=
		'--theme-font-family-base': `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
		'--theme-font-family-heading': `Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'`,
		'--theme-font-color-base': '0 0 0',
		'--theme-font-color-dark': '255 255 255',
		'--theme-rounded-base': '8px',
		'--theme-rounded-container': '8px',
		'--theme-border-base': '2px',
		// =~= Theme On-X Colors =~=
		'--on-primary': '255 255 255',
		'--on-secondary': '255 255 255',
		'--on-tertiary': '0 0 0',
		'--on-success': '0 0 0',
		'--on-warning': '0 0 0',
		'--on-error': '255 255 255',
		'--on-surface': '0 0 0',
		// =~= Theme Colors  =~=
		// primary | #dc2626
		'--color-primary-50': '250 222 222', // #fadede
		'--color-primary-100': '248 212 212', // #f8d4d4
		'--color-primary-200': '246 201 201', // #f6c9c9
		'--color-primary-300': '241 168 168', // #f1a8a8
		'--color-primary-400': '231 103 103', // #e76767
		'--color-primary-500': '220 38 38', // #dc2626
		'--color-primary-600': '198 34 34', // #c62222
		'--color-primary-700': '165 29 29', // #a51d1d
		'--color-primary-800': '132 23 23', // #841717
		'--color-primary-900': '108 19 19', // #6c1313
		// secondary | #000000
		'--color-secondary-50': '217 217 217', // #d9d9d9
		'--color-secondary-100': '204 204 204', // #cccccc
		'--color-secondary-200': '191 191 191', // #bfbfbf
		'--color-secondary-300': '153 153 153', // #999999
		'--color-secondary-400': '77 77 77', // #4d4d4d
		'--color-secondary-500': '0 0 0', // #000000
		'--color-secondary-600': '0 0 0', // #000000
		'--color-secondary-700': '0 0 0', // #000000
		'--color-secondary-800': '0 0 0', // #000000
		'--color-secondary-900': '0 0 0', // #000000
		// tertiary | #0ea5e9
		'--color-tertiary-50': '219 242 252', // #dbf2fc
		'--color-tertiary-100': '207 237 251', // #cfedfb
		'--color-tertiary-200': '195 233 250', // #c3e9fa
		'--color-tertiary-300': '159 219 246', // #9fdbf6
		'--color-tertiary-400': '86 192 240', // #56c0f0
		'--color-tertiary-500': '14 165 233', // #0ea5e9
		'--color-tertiary-600': '13 149 210', // #0d95d2
		'--color-tertiary-700': '11 124 175', // #0b7caf
		'--color-tertiary-800': '8 99 140', // #08638c
		'--color-tertiary-900': '7 81 114', // #075172
		// success | #22c55e
		'--color-success-50': '222 246 231', // #def6e7
		'--color-success-100': '211 243 223', // #d3f3df
		'--color-success-200': '200 241 215', // #c8f1d7
		'--color-success-300': '167 232 191', // #a7e8bf
		'--color-success-400': '100 214 142', // #64d68e
		'--color-success-500': '34 197 94', // #22c55e
		'--color-success-600': '31 177 85', // #1fb155
		'--color-success-700': '26 148 71', // #1a9447
		'--color-success-800': '20 118 56', // #147638
		'--color-success-900': '17 97 46', // #11612e
		// warning | #f59e0b
		'--color-warning-50': '254 240 218', // #fef0da
		'--color-warning-100': '253 236 206', // #fdecce
		'--color-warning-200': '253 231 194', // #fde7c2
		'--color-warning-300': '251 216 157', // #fbd89d
		'--color-warning-400': '248 187 84', // #f8bb54
		'--color-warning-500': '245 158 11', // #f59e0b
		'--color-warning-600': '221 142 10', // #dd8e0a
		'--color-warning-700': '184 119 8', // #b87708
		'--color-warning-800': '147 95 7', // #935f07
		'--color-warning-900': '120 77 5', // #784d05
		// error | #b91c1c
		'--color-error-50': '245 221 221', // #f5dddd
		'--color-error-100': '241 210 210', // #f1d2d2
		'--color-error-200': '238 198 198', // #eec6c6
		'--color-error-300': '227 164 164', // #e3a4a4
		'--color-error-400': '206 96 96', // #ce6060
		'--color-error-500': '185 28 28', // #b91c1c
		'--color-error-600': '167 25 25', // #a71919
		'--color-error-700': '139 21 21', // #8b1515
		'--color-error-800': '111 17 17', // #6f1111
		'--color-error-900': '91 14 14', // #5b0e0e
		// surface | #e8e8e8
		'--color-surface-50': '252 252 252', // #fcfcfc
		'--color-surface-100': '250 250 250', // #fafafa
		'--color-surface-200': '249 249 249', // #f9f9f9
		'--color-surface-300': '246 246 246', // #f6f6f6
		'--color-surface-400': '239 239 239', // #efefef
		'--color-surface-500': '232 232 232', // #e8e8e8
		'--color-surface-600': '209 209 209', // #d1d1d1
		'--color-surface-700': '174 174 174', // #aeaeae
		'--color-surface-800': '139 139 139', // #8b8b8b
		'--color-surface-900': '114 114 114' // #727272
	}
};
