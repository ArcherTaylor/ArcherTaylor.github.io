"use strict";

var PortfolioPage = function ()
{
	function _updateUrlParameter( strParam, strValue )
	{
		var oRegEx = new RegExp( "([?&])" + strParam + "=.*?(&|$)", "i" );
		var strCurrentUrl = window.location.href;
		var strSeparator = strCurrentUrl.indexOf( '?' ) !== -1 ? "&" : "?";
		var strNewUrl = '';

		if ( strValue )
		{
			if ( strCurrentUrl.match( oRegEx ) )
			{
				strNewUrl = strCurrentUrl.replace( oRegEx, '$1' + strParam + "=" + strValue + '$2' );
			}
			else
			{
				strNewUrl = strCurrentUrl + strSeparator + strParam + "=" + strValue;
			}
		}
		else
		{
			strNewUrl = strCurrentUrl.replace( oRegEx, '' );
		}

		window.history.pushState( "", "", strNewUrl );
	}

	function _convertToQueryObject( strQuery )
	{
		var rgQueryVars = strQuery.split( "&" );
		var rgQuery = {};
		for ( var i = 0; i < rgQueryVars.length; i++ )
		{
			var rgQueryVarsPair = rgQueryVars[ i ].split( "=" );
			// If first entry with this name
			if ( typeof rgQuery[ rgQueryVarsPair[ 0 ] ] === "undefined" )
			{
				rgQuery[ rgQueryVarsPair[ 0 ] ] = decodeURIComponent( rgQueryVarsPair[ 1 ] );
				// If second entry with this name
			}
			else if ( typeof rgQuery[ pair[ 0 ] ] === "string" )
			{
				rgQuery[ rgQueryVarsPair[ 0 ] ] = [
					rgQuery[ rgQueryVarsPair[ 0 ] ], decodeURIComponent( rgQueryVarsPair[ 1 ] )
				];
				// If third or later entry with this name
			}
			else
			{
				rgQuery[ rgQueryVarsPair[ 0 ] ].push( decodeURIComponent( rgQueryVarsPair[ 1 ] ) );
			}
		}
		return rgQuery;
	}

	function _getQueryParamValue( strParam )
	{
		var strQueryParams = window.location.search.substring( 1 );
		var rgQuery = _convertToQueryObject( strQueryParams );
		if ( rgQuery[ strParam ] )
		{
			return rgQuery[ strParam ];
		}
	}

	function _CategoryExpander()
	{
		var m_strSecCatParam = 'sec_cat';

		$J( document ).on(
			'click touch',
			'.sec_tag:not(.selected):not(.empty_answer) > a',
			function ( m_Event )
			{
				m_Event.preventDefault();

				var $m_Sec = $J( this ).parent();

				var m_openSecHeight = 0;
				if ( $m_Sec.prevAll( '.selected' ).length > 0 )
				{
					m_openSecHeight = parseInt( $m_Sec.prevAll( '.selected' ).css( 'padding-bottom' ), 10 );
				}

				_updateUrlParameter( m_strSecCatParam, $m_Sec.data( m_strSecCatParam ) )

				$m_Sec.siblings().removeClass( 'selected' ).css( 'padding-bottom', 0 );
				$m_Sec.siblings().find( '.sec_openings_wrapper' ).height( 0 );
				$m_Sec.addClass( 'selected' );

				var $m_secOpeningsInnerWrapper = $m_Sec.find( '.sec_openings_inner_wrapper' );
				var $m_secOpeningsWrapper = $m_Sec.find( '.sec_openings_wrapper' );

				var m_iSecOpeningsNewHeight = $m_secOpeningsInnerWrapper.outerHeight( true );
				$m_secOpeningsWrapper.height( m_iSecOpeningsNewHeight );

				var m_iSecOpeningsNewParentPadding = $m_secOpeningsInnerWrapper.outerHeight( true ) + 100;
				$m_Sec.css( 'padding-bottom', m_iSecOpeningsNewParentPadding );

				var m_SecOffsetTop = $m_Sec.offset().top - m_openSecHeight;

				if ( m_SecOffsetTop < $J( window ).scrollTop() )
				{
					var m_newScrollTop = m_SecOffsetTop - 50;
					setTimeout(
						function()
						{
							$J( 'html, body' ).animate( {
								scrollTop: m_newScrollTop
							}, 500 );
						},
						250
					);
				}
			}
		);

		$J( document ).on(
			'click touch',
			'.sec_tag.selected > a',
			function ( m_Event )
			{
				m_Event.preventDefault();
				var $m_Sec = $J(this).parent();
				_updateUrlParameter( m_strSecCatParam, '' )
				$m_Sec.removeClass( 'selected' ).css( 'padding-bottom', 0 );
				$m_Sec.find( '.sec_openings_wrapper' ).height( 0 );
			}
		);

		var m_strOpenSecCategory = _getQueryParamValue( m_strSecCatParam );
		if ( m_strOpenSecCategory )
		{
			m_strOpenSecCategory = m_strOpenSecCategory.replace( /[^a-zA-Z0-9\/_|+ -]/g, '' );
			var $m_OpenSecCategory = $J( '[data-' + m_strSecCatParam + '=' + m_strOpenSecCategory + ']' );
			if ( $m_OpenSecCategory.length > 0 )
			{
				$m_OpenSecCategory.find( ' > a' ).click();
				var m_iSecCatTop = $m_OpenSecCategory.offset().top - 100;
				if ( $J( window ).scrollTop() === 0 )
				{
					$J( 'html,body' ).animate( { scrollTop: m_iSecCatTop }, 500 );
				}
			}
		}
	}

	function _VideoRotator( iLastVideoIdx )
	{
		var $elVideos = $J( '#page_background_videos .background_video' );

		if ( $J( window ).width() < 1000 )
		{
			$elVideos.find( ':not(.mobile)' ).remove();
		}

		if ( $elVideos.length > 0 )
		{
			var iCurrentVideoIdx = 0;
			if ( iLastVideoIdx !== undefined )
			{
				if ( iLastVideoIdx < $elVideos.length - 1 )
				{
					iCurrentVideoIdx = iLastVideoIdx + 1;
				}
			}

			$elVideos.off();
			$elVideos.css( 'opacity', '0' );
			$J( $elVideos[ iCurrentVideoIdx ] ).css( 'opacity', '1' )
			$elVideos.get( iCurrentVideoIdx ).play();
			$J( $elVideos[ iCurrentVideoIdx ] ).on(
				'ended',
				function ()
				{
					_VideoRotator( iCurrentVideoIdx );
				}
			)
		}
	}

	function Init()
	{
		_CategoryExpander();
		_VideoRotator();
	}

	return {
		Init: Init
	}
}();

$J( document ).ready(
	function ()
	{
		PortfolioPage.Init();
	}
);