import { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const nextConfig: NextConfig = {
	webpack(config) {
		config.module.rules.push({
			test: /\.svg$/,
			use: [
				{
					loader: '@svgr/webpack',
					options: {
						icon: true,
					},
				},
			],
		})
		return config
	},
	turbopack: {
		rules: {
			'*.svg': {
				loaders: ['@svgr/webpack'],
				as: '*.js',
			},
		},
	},
	images: {
		domains: ['knu-icc.netlify.app'],
		loader: 'custom',
		loaderFile: './src/lib/netlifyImageLoader.ts',
	},
}

const withNextIntl = createNextIntlPlugin()
export default withNextIntl(nextConfig)
