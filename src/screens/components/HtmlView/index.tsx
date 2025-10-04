import React from 'react'
import RenderHtml, { RenderHTMLProps } from 'react-native-render-html'

type Props = Partial<RenderHTMLProps> & {
	html: string
}

const HtmlView = ({ html, ...props }: Props) => {
	return (
		<RenderHtml
			{...props}
			baseStyle={{
				flexWrap: 'wrap',
				whiteSpace: 'pre',
				color: '#8F8686',
				lineHeight: 22,
			}}
			source={{ html: html?.replace(/<br \/>\n/g, '\n') }}
			tagsStyles={{
				p: {
					marginTop: 0,
					marginBottom: 0,
					paddingTop: 0,
					paddingBottom: 0,
				},
			}}
		/>
	)
}

export default HtmlView
