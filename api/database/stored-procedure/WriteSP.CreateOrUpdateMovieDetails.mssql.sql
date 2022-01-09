DROP PROCEDURE IF EXISTS WriteSP.CreateOrUpdateMovieDetails
GO

CREATE PROCEDURE WriteSP.CreateOrUpdateMovieDetails(
	@Name NVARCHAR(250),
	@Size NVARCHAR(255),
	@UserGuid UNIQUEIDENTIFIER,
	@VideoGuid UNIQUEIDENTIFIER
)
AS
BEGIN
	DECLARE @NewGuid UNIQUEIDENTIFIER = NEWID()

	IF @VideoGuid IS NOT NULL
		UPDATE Video
		SET 
			FileName = @Name,
			Size = @Size,
			ModifiedOn = GETUTCDATE(),
			ModifiedBy = @UserGuid
		WHERE Guid = @VideoGuid
	ELSE
		BEGIN TRY
			BEGIN TRANSACTION
				INSERT INTO Video
				(
					Guid,
					FileName,
					Size,
					CreatedOn,
					ModifiedOn,
					CreatedBy,
					ModifiedBy,
					IsDeleted,
					Status
				)
				VALUES
				(
					@NewGuid,
					@Name,
					@Size,
					GETUTCDATE(),
					GETUTCDATE(),
					@UserGuid,
					@UserGuid,
					0,
					1
				)
			COMMIT TRANSACTION;
		END TRY
		BEGIN CATCH
            IF @@TRANCOUNT > 0 
                ROLLBACK TRANSACTION;
        END CATCH

	SELECT @NewGuid AS 'videoId'
END