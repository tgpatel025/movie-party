DROP PROCEDURE IF EXISTS WriteSP.UpdateVideoStatus
GO

CREATE PROCEDURE WriteSP.UpdateVideoStatus(
	@Status INT,
	@VideoGuid UNIQUEIDENTIFIER
)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION
            UPDATE Video SET Status = @Status WHERE Guid = @VideoGuid
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0 
            ROLLBACK TRANSACTION;
    END CATCH
END